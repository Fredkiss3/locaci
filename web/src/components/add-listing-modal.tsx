import * as React from 'react';
// components
import { Modal, TextInput } from '@locaci/ui';
import { BottomSheet } from '@locaci/ui/src/components/atoms/bottom-sheet';
import { MagnifyingGlass, PlusCircle } from 'phosphor-react';
import { NextLinkButton } from './next-link';

// utils
import useMediaQuery from '../hooks/use-media-query';
import { useListingModalStore } from '@web/hooks/use-listing-modal-store';

// types
export type AddListingModalProps = {};

export default function AddListingModal({}: AddListingModalProps) {
    const { open, onClose } = useListingModalStore(state => ({
        open: state.open,
        onClose: state.hide
    }));

    const ModalContent = () => (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-10">
            <img
                src="/property_not_found.svg"
                alt="Illustration Propriété non trouvée"
                className="h-40 w-40"
            />
            <h3 className="text-2xl font-bold">Aucune propriété trouvée</h3>
            <p className="text-center text-gray">
                Ajouter une nouvelle propriété pour accueillir vos prochains
                locataires
            </p>
        </div>
    );

    const canShowModal = useMediaQuery(`(min-width: 768px)`);

    return (
        <>
            <BottomSheet
                open={open}
                onDismiss={onClose}
                className={`md:hidden`}
                expandOnContentDrag
                header={
                    <TextInput
                        appendix={<MagnifyingGlass weight="bold" />}
                        className="w-full"
                        label="Choisir une de vos propriétés"
                        onChange={function noRefCheck() {}}
                        onChangeValue={function noRefCheck() {}}
                        placeholder="Recherche"
                        type="search"
                    />
                }
                defaultSnap={({ minHeight }) => minHeight}
                snapPoints={({ maxHeight, minHeight }) => [
                    minHeight,
                    maxHeight * 0.65,
                    maxHeight * 0.95
                ]}
                footer={
                    <NextLinkButton
                        onClick={onClose}
                        href="/owner/properties/add"
                        className="w-full"
                        variant="dark"
                        renderLeadingIcon={cls => (
                            <PlusCircle className={cls} weight={'bold'} />
                        )}>
                        Nouvelle propriété
                    </NextLinkButton>
                }>
                <ModalContent />
            </BottomSheet>

            <Modal
                title="Recherche"
                isOpen={open && canShowModal}
                onClose={onClose}
                footer={
                    <NextLinkButton
                        onClick={onClose}
                        href="/owner/properties/add"
                        className="w-full"
                        variant="dark"
                        renderLeadingIcon={cls => (
                            <PlusCircle className={cls} weight={'bold'} />
                        )}>
                        Nouvelle propriété
                    </NextLinkButton>
                }>
                <TextInput
                    appendix={<MagnifyingGlass weight="bold" />}
                    className="w-full"
                    label="Choisir une de vos propriétés"
                    onChange={function noRefCheck() {}}
                    onChangeValue={function noRefCheck() {}}
                    placeholder="Recherche"
                    type="search"
                />
                <ModalContent />
            </Modal>
        </>
    );
}
