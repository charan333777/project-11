'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteConfirmationProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
    isDeleting?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    isOpen,
    onClose,
    onConfirm,
    jobTitle,
    isDeleting = false,
}) => {
    const handleClose = () => {
        if (isDeleting) return;
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Delete Application"
            footer={
                <>
                    <Button variant="ghost" onClick={handleClose} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </>
            }
        >
            <p className="text-neutral-700 dark:text-gray-300">
                Are you sure you want to delete the application for{' '}
                <span className="font-semibold text-neutral-900 dark:text-white">{jobTitle}</span>? This action cannot be undone.
            </p>
        </Modal>
    );
};
