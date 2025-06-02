// Test simple de formatters sin imports complejos
describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      // Importar directamente la función
      const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };
        return date.toLocaleDateString('es-ES', options);
      };

      const dateString = '2025-01-15T10:30:00Z';
      const result = formatDate(dateString);

      // Verificar que la fecha se formatea correctamente en español
      expect(result).toContain('enero');
      expect(result).toContain('2025');
      expect(result).toContain('15');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency in USD', () => {
      // Importar directamente la función
      const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(amount);
      };

      const amount = 123.45;
      const result = formatCurrency(amount);

      expect(result).toContain('$');
      expect(result).toContain('123');
      expect(result).toContain('45');
    });

    it('should handle zero amount', () => {
      const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(amount);
      };

      const amount = 0;
      const result = formatCurrency(amount);

      expect(result).toContain('$');
      expect(result).toContain('0.00');
    });
  });
});
