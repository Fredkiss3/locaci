import * as React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { Modal, ModalProps } from '../../components/atoms/modal';
import { TextInput } from '../../components/atoms/input';
import { Checkbox } from '../../components/atoms/checkbox';
import { Button } from '../../components/atoms/button';

// @ts-ignore
import GoogleLogoSVG from '../assets/Google__G__Logo.svg';

export default {
    title: 'Composants/Atoms/Modal',
    component: Modal
} as ComponentMeta<typeof Modal>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Modal> = args => <Modal {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: `Modal Title`,
    isOpen: true,
    children: (
        <>
            <div className="flex flex-col gap-4 text-center text-lg">
                Modal content
            </div>
        </>
    ),
    footer: (
        <div className="flex flex-col gap-4 text-center text-lg">
            Modal Footer
        </div>
    )
} as ModalProps;

export const Complex = Template.bind({});
Complex.args = {
    title: `Connexion`,
    isOpen: true,
    children: (
        <>
            <div className="flex flex-col gap-4 text-center text-lg">
                <TextInput
                    className="w-full"
                    label="Email"
                    placeholder="kkouakou@gmail.com"
                    defaultValue="kkouakou@gmail.com"
                />

                <Checkbox label="Accepter les CGU ?" checked />

                <Button variant="primary">Connexion</Button>

                <div className="flex items-center gap-2 my-2">
                    <hr className="h-[1px] bg-lightgray w-full" />
                    <span className="text-gray">Ou</span>
                    <hr className="h-[1px] bg-lightgray w-full" />
                </div>

                <Button
                    variant="outline"
                    renderLeadingIcon={cls => (
                        <img src={GoogleLogoSVG} className={cls} />
                    )}>
                    Connectez-vous avec google
                </Button>
            </div>
        </>
    ),
    footer: (
        <p className="w-full inline-flex justify-center text-gray">
            Vous avez déjà un compte ?&nbsp;
            <strong className="font-bold cursor-pointer hover:underline">
                Connectez-vous
            </strong>
        </p>
    ),
    footerClassName: `bg-lightgray`
} as ModalProps;
