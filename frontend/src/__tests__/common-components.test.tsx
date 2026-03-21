import { render, screen } from '@testing-library/react';
import Alert from '../components/common/Alert/Alert';
import Card from '../components/common/Card/Card';
import FormError from '../components/common/Form/FormError';

describe('common helper components', () => {
  it('renders alert only when message exists', () => {
    const { rerender } = render(<Alert message="Saved" variant="success" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Saved');

    rerender(<Alert />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders card content', () => {
    render(<Card className="custom-card"><span>Body</span></Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('renders form errors accessibly', () => {
    const { rerender } = render(<FormError message="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');

    rerender(<FormError />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
