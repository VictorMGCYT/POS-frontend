

export function capitalizeWords(str: string): string {
    const stringCapitalized = str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return stringCapitalized;
}