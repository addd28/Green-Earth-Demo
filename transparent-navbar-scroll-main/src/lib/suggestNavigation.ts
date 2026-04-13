import type { SuggestItem } from "@/hooks/useSearchSuggest";

export function pathForSuggestItem(item: SuggestItem): string {
  if (item.type === "page" && item.path) return item.path;
  if (item.type === "campaign" && item.id != null) return `/campaign/${item.id}`;
  if (item.type === "article" && item.id != null) return `/news/${item.id}`;
  if (item.type === "event" && item.id != null) return `/events/${item.id}`;
  return "/";
}

export const TYPE_LABEL: Record<string, string> = {
  campaign: "Campaign",
  article: "News",
  event: "Event",
  page: "Page",
};
