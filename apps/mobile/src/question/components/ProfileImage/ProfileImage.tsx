import { useState, useEffect } from "react";
import { Pressable, Image } from "react-native";
import { useUsers } from "../../../shared/hooks/users";

export const ProfileImage = ({ onPress }: { onPress: () => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const users = useUsers();
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
        width={40}
        height={40}
        style={{ borderRadius: 20 }}
      />
    </Pressable>
  ) : null;
};
