import React, { useState } from "react";
import { Label, LikeIcon } from "@pushinbar-ru/bar-ui";

// import styles from "./styles.module.css";

export interface LikeProps {
  count: number;
  isClickable?: boolean;
}

const Like = ({ count, isClickable = false }: LikeProps) => {
  const [liked, setLiked] = useState(false);

  return (
    <Label
      size="large"
      icon={<LikeIcon />}
      onClick={() => isClickable && setLiked(!liked)}
      selected={liked}
    >
      {liked ? count + 1 : count}
    </Label>
  );
};

export default Like;
