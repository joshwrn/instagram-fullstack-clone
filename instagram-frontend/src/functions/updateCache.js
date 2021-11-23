const updateCacheWith = (client, newItem, query, variables, data) => {
  const includedIn = (set, object) => set.map((p) => p.id).includes(object.id);
  const dataInStore = client.readQuery({
    query: query,
    variables: variables,
  });
  if (!dataInStore) return;
  if (!includedIn(dataInStore[data], newItem)) {
    client.writeQuery({
      query: query,
      variables: variables,
      data: { readMessages: [newItem, ...dataInStore[data]] },
    });
  }
};

export default updateCacheWith;
