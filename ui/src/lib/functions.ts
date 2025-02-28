/**
 * Petit utilitaire pour chainer les classes css en react tout en évitant
 *  les "false" et "null" dans les classes.
 *
 *  @example
 *    const classes = clsx(
 *        "class1",
 *        "class2",
 *        undefined,
 *        {
 *          class3: true,
 *          class4: false,
 *        });
 *     // retournera "class1 class2 class3"
 *
 * @param args
 */
export function clsx(
    ...args: (string | undefined | Record<string, boolean>)[]
): string {
    const classes: string[] = [];
    for (const arg of args) {
        switch (typeof arg) {
            case 'string':
                if (arg) {
                    classes.push(arg);
                }
                break;
            case 'object':
                if (arg) {
                    for (const key in arg) {
                        if (arg[key]) {
                            classes.push(key);
                        }
                    }
                }
                break;
        }
    }
    return classes.join(' ');
}

/**
 * Convertit un montant en centimes en un montant en euros et le formatter correctement
 * @param amount montant en centimes
 */
export function formatNumberToFCFA(amount: number): string {
    return amount.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Generate an array of numbers from start to the end
 *
 * @example
 *      range(1, 5);
 *      // => [1, 2, 3, 4]
 * @param start
 * @param end
 * @returns
 */
export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, i) => i + start);
}

/**
 * Get a range of 5 pages no matter which page we are in the pagination,
 *  It returns the pages in the order [n-2, n-1, n, n+1, n+2] when possible
 *  ie: the pages numbers are not negative, and are not greater than the total.
 * @example
 *      getPageRange(1, 10)  // => [1,2,3,4,5]
 *      getPageRange(4, 10)  // => [2,3,4,5,6]
 *      getPageRange(10, 10) // => [6,7,8,9,10]
 * @param currentPage
 * @param nbPages
 */
export function getPageRange(currentPage: number, nbPages: number) {
    const start = Math.max(1, currentPage - 2);
    const end = start + 4;

    let pages: number[];
    if (end <= nbPages) {
        pages = range(start, end);
    } else {
        pages = range(Math.max(1, nbPages - 3), nbPages + 1);
    }

    return pages;
}

/**
 * Get initials for a name formatted as "first last"
 *
 * @example
 *      getInitials("John Doe") // => 'JD'
 * @param fullName
 */
export function getInitials(fullName: string): string {
    const names = fullName.split(' ').filter(Boolean);
    const initials: string[] = [];

    for (const name of names) {
        if (name.trim().length > 0) {
            initials.push(name.charAt(0));
        }
    }

    return initials.join('').toUpperCase();
}

export function formatDateToFrenchDate(date: string | Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
}

/**
 * Convert a date to a value separated by minus signs,
 * if not date is passed, it returns undefined
 *
 * @example
 *      formatDateToSimpleDate(new Date(0)); // "1970-1-1"
 *
 * @param date
 * @returns
 */
export function formatDateToSimpleDate(date: string | Date | undefined) {
    if (!date) return undefined;

    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
}
