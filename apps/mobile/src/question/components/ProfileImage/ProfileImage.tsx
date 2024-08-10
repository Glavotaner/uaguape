import { useState, useEffect } from "react";
import { Pressable, Image } from "react-native";
import { useUsers } from "../../../shared/hooks/users";
import { useStyle } from "./ProfileImage.styles";

export const ProfileImage = ({ onPress }: { onPress: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const users = useUsers();
  const styling = useStyle();

  useEffect(() => {
    const fetchProfileImage = async () => {
      const user = await users.get();
      if (user.picture) {
        setImage(user.picture);
      }
    };
    fetchProfileImage();
  }, []);

  return image ? (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri: image }}
        width={styling.image.width}
        height={styling.image.height}
        style={{ borderRadius: styling.image.borderRadius }}
      />
    </Pressable>
  ) : null;
};
