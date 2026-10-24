import { DateTime } from "luxon";
import { COMMA_REGEX, DATE_FORMAT_YYYYMMDD } from "./constants";
import _ from "lodash";

export const formatDateToString = (date: Date, fmt: string = DATE_FORMAT_YYYYMMDD) => {
    return DateTime.fromJSDate(date).toFormat(fmt);
};

export const formatNumberComma = (
    value: number | null | undefined,
    emptyText: string = "",
    prefix: string = "",
    suffix: string = "",
): string => {
    if (!_.isNumber(value) || !_.isFinite(value)) {
        return emptyText;
    }
    return prefix + value.toLocaleString("en-US") + suffix;
};

export const commaStringToNumber = (v: string | null | undefined): number | null => {
    if (!v) {
        return null;
    }
    const n = _.toNumber(_.replace(v, COMMA_REGEX, ""));
    return _.isFinite(n) ? n : null;
};

export const formatStringToStringComma = (v: string | null | undefined): string => {
    if (!v) {
        return "";
    }
    const numberValue = commaStringToNumber(v);
    return numberValue ? formatNumberComma(numberValue) : v;
};

export const formatLargeNumber = (value: number): string => {
    // Trillions
    // 1_500_000_000_000 => -> 1.5T
    if (value >= 1_000_000_000_000) {
        return `${(value / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '')}T`;
    }
    // Billions
    // 1_500_000_000 => 1.5B
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    // Millions
    // 1_500_000 => 1.5M
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    // Thousands
    // 2_250 => 2.3k
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    // Less than 1000
    // 750 => 750
    return `${value}`;
};

export const getDayName = (dateString: string) => {
    return DateTime.fromISO(dateString).toFormat('ccc'); // Mon, Tue, Wed...
};

export function calculatePercentageChange(
    current: number | undefined,
    previous: number | undefined
): number | null {
    if (current === undefined || previous === undefined) {
        return null;
    }

    if (previous === 0) {
        return current === 0 ? 0 : null;
    }

    return ((current - previous) / previous) * 100;
}