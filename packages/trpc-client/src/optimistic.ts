/**
 * Represents the query utilities interface from tRPC useUtils
 */
export type QueryUtils<T> = {
  cancel: () => Promise<void>;
  getData: () => T[] | undefined;
  setData: (
    input: undefined,
    updater: (old: T[] | undefined) => T[] | undefined
  ) => void;
  invalidate: () => Promise<void>;
};

/**
 * Constraint for entities with an ID field
 */
export type WithId<TId = number | string> = { id: TId };

/**
 * Cache manipulation methods for list-based queries
 */
export type CacheMethods<T extends WithId<TId>, TId = T["id"]> = {
  cancel: () => Promise<void>;
  get: () => T[];
  set: (updater: (items: T[] | undefined) => T[] | undefined) => void;
  invalidate: () => Promise<void>;
  add: (item: Omit<T, "id"> & { id?: TId }) => void;
  remove: (id: TId) => void;
  update: (id: TId, updates: Partial<T>) => void;
  find: (id: TId) => T | undefined;
};

type OptimisticOptions<TInput> = {
  action: (input: TInput) => void;
  onError?: (err: { message: string }) => void;
};

type TempIdConfig<TId> = {
  generateTempId?: () => TId;
};

/**
 * Creates a cache manager for list-based queries with optimistic update support.
 * Works with any entity type that has an `id` field.
 *
 * @example
 * ```tsx
 * const cache = createListCache(trpc.useUtils().todos.list);
 *
 * const createMutation = trpc.todos.create.useMutation(
 *   cache.withOptimistic(({ add }) => ({
 *     action: (input) => add({ ...input, createdAt: new Date() }),
 *     onError: (err) => toast.error(err.message),
 *   }))
 * );
 * ```
 */
export function createListCache<T extends WithId<TId>, TId = T["id"]>(
  query: QueryUtils<T>,
  config?: TempIdConfig<TId>
) {
  const generateTempId = config?.generateTempId ?? (() => -Date.now() as TId);

  const methods: CacheMethods<T, TId> = {
    cancel: () => query.cancel(),

    get: () => query.getData() ?? [],

    set: (updater) => query.setData(undefined, updater),

    invalidate: () => query.invalidate(),

    add: (item) =>
      query.setData(undefined, (old) => [
        ...(old ?? []),
        { id: generateTempId(), ...item } as T,
      ]),

    remove: (id) =>
      query.setData(undefined, (old) => old?.filter((t) => t.id !== id)),

    update: (id, updates) =>
      query.setData(undefined, (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...updates } : t))
      ),

    find: (id) => query.getData()?.find((t) => t.id === id),
  };

  return {
    ...methods,

    withOptimistic: <TInput>(
      optionsFn: (cache: CacheMethods<T, TId>) => OptimisticOptions<TInput>
    ) => {
      const options = optionsFn(methods);

      return {
        onMutate: async (input: TInput) => {
          await methods.cancel();
          const previous = methods.get();
          options.action(input);
          return { previous };
        },

        onError: (
          err: { message: string },
          _: TInput,
          ctx?: { previous: T[] }
        ) => {
          methods.set(() => ctx?.previous ?? []);
          options.onError?.(err);
        },

        onSettled: () => methods.invalidate(),
      };
    },
  };
}

export type ListCache<T extends WithId> = ReturnType<typeof createListCache<T>>;
