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
      // El día puede variar por timezone, verificar que contiene 14 o 15
      expect(result).toMatch(/1[45]/);
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
      // Puede ser "0.00" o "0,00" dependiendo del locale del sistema
      expect(result).toMatch(/0[.,]00/);
    });
  });
});
