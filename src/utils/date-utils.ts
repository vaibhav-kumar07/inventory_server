import moment from "moment-timezone";

export const getGMTFormattedDate = (): string => {
    return moment().tz("GMT").format("YYYY-MM-DD");
};


