import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('does not render content when open is false', () => {
    render(
      <Modal open={false} onClose={() => {}} title="Test Modal">
        <p>Hidden Content</p>
      </Modal>
    );
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('renders title, subtitle, and children when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Create Trip" subtitle="Enter your trip details">
        <p>Modal Body Text</p>
      </Modal>
    );
    expect(screen.getByText('Create Trip')).toBeInTheDocument();
    expect(screen.getByText('Enter your trip details')).toBeInTheDocument();
    expect(screen.getByText('Modal Body Text')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        <button>Inside Button</button>
      </Modal>
    );
    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Test Modal">
        <input placeholder="Type here" />
      </Modal>
    );
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("without the header close button, Tab cycles only the dialog's own actions", () => {
    render(
      <Modal open onClose={() => {}} title="Confirm recovery" hideCloseButton>
        <button>Cancel</button>
        <button>Confirm</button>
      </Modal>
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    const [cancel, confirm] = ['Cancel', 'Confirm'].map((n) => screen.getByRole('button', { name: n }));
    confirm.focus();
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(confirm);
  });
});
