import { DateTime } from "luxon";

export function selectDateTimeTypeAndLength(type: string, length: number): DateTime {
	switch (type) {
		case "DATETIME":
			switch (length) {
				case 1:
					return DateTime.DATETIME_SHORT as DateTime;
				case 2:
					return DateTime.DATETIME_MED as DateTime;
				case 3:
					return DateTime.DATETIME_FULL as DateTime;
				case 4:
					return DateTime.DATETIME_HUGE as DateTime;
				default:
					return DateTime.DATETIME_MED as DateTime;
			}
		case "DATE":
			switch (length) {
				case 1:
					return DateTime.DATE_SHORT as DateTime;
				case 2:
					return DateTime.DATE_MED as DateTime;
				case 3:
					return DateTime.DATE_FULL as DateTime;
				case 4:
					return DateTime.DATE_HUGE as DateTime;
				default:
					return DateTime.DATE_MED as DateTime;
			}
		case "TIME":
			switch (length) {
				case 1:
					return DateTime.TIME_SIMPLE as DateTime;
				case 2:
					return DateTime.TIME_WITH_SECONDS as DateTime;
				case 3:
					return DateTime.TIME_WITH_SHORT_OFFSET as DateTime;
				case 4:
					return DateTime.TIME_WITH_LONG_OFFSET as DateTime;
				default:
					return DateTime.TIME_SIMPLE as DateTime;
			}
	}
}