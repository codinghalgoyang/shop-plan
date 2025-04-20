import { ITEM_HEIGHT } from "@/utils/Shapes";
import { ItemGroup, Plan } from "@/utils/types";
import { FlatList } from "react-native";
import EditItemGroupCategoryView from "./EditItemGroupCategoryView";

interface EditItemGroupFlatListProps {
  plan: Plan;
  editingItemGroup: ItemGroup;
}

export default function EditItemGroupFlatList({
  plan,
  editingItemGroup,
}: EditItemGroupFlatListProps) {
  const data: ItemGroup[] = plan.itemGroups;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      renderItem={({ item: itemGroup }) => {
        return (
          <EditItemGroupCategoryView
            plan={plan}
            itemGroup={itemGroup}
            editingItemGroup={editingItemGroup}
            hasMultipleItemGroup={plan.itemGroups.length > 1}
          />
        );
      }}
    />
  );
}
