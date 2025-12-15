type QueryUtils<T> = {
  cancel: () => Promise<void>;
  getData: () => T[] | undefined;
  setData: (input: undefined, updater: (old: T[] | undefined) => T[] | undefined) => void;
  invalidate: () => Promise<void>;
};

type WithId<TId = number | string> = { id: TId };

type CacheMethods<T extends WithId<TId>, TId = T["id"]> = {
  cancel: () => Promise<void>;
  get: () => T[];
  set: (updater: (items: T[] | undefined) => T[] | undefined) => void;
  invalidate: () => Promise<void>;
  add: (item: Omit<T, "id"> & { id?: TId }) => void;
  remove: (id: TId) => void;
  update: (id: TId, updates: Partial<T>) => void;
};

type OptimisticOptions<TInput> = {
  action: (input: TInput) => void;
  onError?: (err: { message: string }) => void;
};

export function createListCache<T extends WithId>(query: QueryUtils<T>) {
  type TId = T["id"];

  const methods: CacheMethods<T, TId> = {
    cancel: () => query.cancel(),
    get: () => query.getData() ?? [],
    set: (updater) => query.setData(undefined, updater),
    invalidate: () => query.invalidate(),

    add: (item) =>
      query.setData(undefined, (old) => [
        ...(old ?? []),
        { id: -Date.now(), ...item } as T,
      ]),

    remove: (id) =>
      query.setData(undefined, (old) => old?.filter((t) => t.id !== id)),

    update: (id, updates) =>
      query.setData(undefined, (old) =>
        old?.map((t) => (t.id === id ? { ...t, ...updates } : t))
      ),
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
        onError: (err: { message: string }, _: TInput, ctx?: { previous: T[] }) => {
          methods.set(() => ctx?.previous ?? []);
          options.onError?.(err);
        },
        onSettled: () => methods.invalidate(),
      };
    },
  };
}

export type ListCache<T extends WithId> = ReturnType<typeof createListCache<T>>;
