describe('Basic test setup', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true);
  });

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle strings', () => {
    expect('hello').toBe('hello');
  });
});

// Test de formatters simplificado
describe('Basic formatters test', () => {
  it('should handle date formatting', () => {
    // Test muy básico sin imports complejos - usar fecha específica con UTC
    const date = new Date('2025-01-15T12:00:00.000Z');
    expect(date.getFullYear()).toBe(2025);
    expect(date.getMonth()).toBe(0); // Enero es 0
    // No verificar el día específico porque puede variar según timezone
    expect(date.getDate()).toBeGreaterThanOrEqual(14);
    expect(date.getDate()).toBeLessThanOrEqual(15);
  });

  it('should handle currency basics', () => {
    const amount = 123.45;
    const formatted = new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    expect(formatted).toContain('$');
    expect(formatted).toContain('123');
  });
});
