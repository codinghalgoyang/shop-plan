import { ITEM_HEIGHT } from "@/utils/Shapes";
import { isItemGroupType, Item, ItemGroup, Plan } from "@/utils/types";
import { FlatList, View } from "react-native";
import EditItemCategoryView from "./EditItemCategoryView";
import EditItemItemView from "./EditItemItemView";

interface EditItemFlatListProps {
  plan: Plan;
  editingItem: Item;
}

export default function EditItemFlatList({
  plan,
  editingItem,
}: EditItemFlatListProps) {
  const data: (ItemGroup | Item)[] = plan.itemGroups.flatMap((itemGroup) => [
    itemGroup,
    ...itemGroup.items.map((item) => ({ ...item })),
  ]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      renderItem={({ item: itemGroupOrItem }) => {
        if (isItemGroupType(itemGroupOrItem)) {
          const itemGroup = itemGroupOrItem as ItemGroup;
          return (
            <EditItemCategoryView
              plan={plan}
              itemGroup={itemGroup}
              editingItem={editingItem}
              hasMultipleItemGroup={plan.itemGroups.length > 1}
            />
          );
        } else {
          const item = itemGroupOrItem as Item;
          const itemGroup = plan.itemGroups.find(
            (itemGroup) => itemGroup.id === item.itemGroupId
          );
          if (!itemGroup) {
            return null;
          }

          return (
            <EditItemItemView
              key={item.id}
              plan={plan}
              item={item}
              editingItem={editingItem}
            />
          );
        }
      }}
    />
  );
}
