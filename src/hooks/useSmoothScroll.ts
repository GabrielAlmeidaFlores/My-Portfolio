import { useContext } from "react";
import { SmoothScrollContext } from "@/components/providers/smoothScrollContext";

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}
