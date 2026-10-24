export const EMAIL_REGEX = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
// export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const DATE_FORMAT_YYYYMMDD = "yyyy-MM-dd";
export const COMMA_REGEX = /,/g;
export const PAGE_SIZE_DEFAULT = 10;

export const USER_ROLE = {
    admin: "admin",
    staff: "staff",
} as const;

export const COLORS = {
    pos: '#27272A', // text-zinc-800
    eatclub: '#1D4ED8', // text-blue-700
    labour: '#C2410C', // text-orange-700
    prevPos: '#27272A80', // text-zinc-800/50  (50% opacity)
    prevEatclub: '#1D4ED880', // text-blue-700/50
    prevLabour: '#C2410C80', // text-orange-700/50
};