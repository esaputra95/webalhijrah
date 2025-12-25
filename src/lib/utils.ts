import { SettingType } from "@/types/settingSchema";

/**
 * Groups settings by their 'type' and 'key' properties.
 * Transforms an array of SettingType into a nested record: Record<type, Record<key, label>>
 *
 * @param data Array of settings fetched from API
 * @returns A nested record of settings
 */
export const groupSettings = (data: SettingType[] | undefined) => {
  return (data || []).reduce<Record<string, Record<string, string | null>>>(
    (acc, item) => {
      if (item.type && !acc[item.type]) acc[item.type] = {};
      if (item.type && item.key) {
        acc[item.type][item.key] = item.label || null;
      }
      return acc;
    },
    {}
  );
};
