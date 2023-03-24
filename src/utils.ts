export function padLeft(v: number, n: number, str: string = '0'): string {
    return (
        (v < 0 ? '-' : '') +
        Array(n - String(Math.abs(v)).length + 1).join(str || '0') +
        Math.abs(v)
    );
}

function formatDate(date: Date) {
    // Data about date
    const format = {
        dd: padLeft(date.getDate(), 2),
        mm: padLeft(date.getMonth() + 1, 2),
        yyyy: date.getFullYear(),
    };

    return format;
}

function formatTime(date: Date) {
    // Data about date
    const format = {
        hh: padLeft(date.getHours(), 2),
        mm: padLeft(date.getMinutes(), 2),
        ss: padLeft(date.getSeconds(), 2),
    };

    return format;
}

export function dateToStr(date: Date) {
    const { dd, mm, yyyy } = formatDate(date);
    return `${yyyy}-${mm}-${dd}`;
}

export function dateTimeToStr(date: Date) {
    const { dd, mm, yyyy } = formatDate(date);
    const { hh: HH, mm: MM, ss: SS } = formatTime(date);
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
}
