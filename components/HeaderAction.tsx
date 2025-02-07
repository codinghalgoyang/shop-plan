import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

interface HeaderActionProps {
  IconComponent: React.ComponentType<any>;
  iconName: string;
  onPress: () => void;
}

export default function HeaderAction({
  IconComponent,
  iconName,
  onPress,
}: HeaderActionProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <IconComponent name={iconName} size={28} color="black" />
    </TouchableOpacity>
  );
}
