import React from 'react';

type Props = {
  items: any[];
};

export const GroupLoteModel = (props: Props) => {
  const Groups = React.useMemo(() => {
    const groups: Record<string, Record<string, any[]>> = {};
    props.items.forEach((item: any) => {
      if (!groups[item.lote]) groups[item.lote] = {};
      if (!groups[item.lote][item.model]) groups[item.lote][item.model] = [];
      groups[item.lote][item.model].push(item);
    });
    return groups;
  }, [props.items]);

  return Groups;
};
