export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('es-ES', options);
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
}