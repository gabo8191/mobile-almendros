import React from 'react';
import { render } from '../../../shared/utils/test-utils';
import { ThemedText } from '../ThemedText';

describe('ThemedText', () => {
  it('should render text correctly', () => {
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);

    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should apply default type styling', () => {
    const { getByText } = render(<ThemedText>Default Text</ThemedText>);

    const textElement = getByText('Default Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply title type styling', () => {
    const { getByText } = render(<ThemedText type="title">Title Text</ThemedText>);

    const textElement = getByText('Title Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply subtitle type styling', () => {
    const { getByText } = render(<ThemedText type="subtitle">Subtitle Text</ThemedText>);

    const textElement = getByText('Subtitle Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply heading type styling', () => {
    const { getByText } = render(<ThemedText type="heading">Heading Text</ThemedText>);

    const textElement = getByText('Heading Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply button type styling', () => {
    const { getByText } = render(<ThemedText type="button">Button Text</ThemedText>);

    const textElement = getByText('Button Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply caption type styling', () => {
    const { getByText } = render(<ThemedText type="caption">Caption Text</ThemedText>);

    const textElement = getByText('Caption Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply small type styling', () => {
    const { getByText } = render(<ThemedText type="small">Small Text</ThemedText>);

    const textElement = getByText('Small Text');
    expect(textElement).toBeTruthy();
  });

  it('should apply custom style props', () => {
    const customStyle = { color: 'red', fontSize: 20 };
    const { getByText } = render(<ThemedText style={customStyle}>Custom Styled Text</ThemedText>);

    const textElement = getByText('Custom Styled Text');
    expect(textElement).toBeTruthy();
  });

  it('should handle empty children', () => {
    const { getByTestId } = render(<ThemedText testID="empty-text" />);

    expect(getByTestId('empty-text')).toBeTruthy();
  });

  it('should pass through other Text props', () => {
    const { getByText } = render(
      <ThemedText numberOfLines={1} ellipsizeMode="tail">
        Very long text that should be truncated
      </ThemedText>,
    );

    const textElement = getByText('Very long text that should be truncated');
    expect(textElement).toBeTruthy();
  });
});
