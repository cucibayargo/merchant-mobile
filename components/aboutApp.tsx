import { Button, Dialog, Modal, Portal, Text } from 'react-native-paper'
import React from 'react'
import { IAboutAppProps } from '@/types/aboutApp'

export const AboutApp = ({ visible, visibleChange }: IAboutAppProps) => {
    return (
        <Portal>
            <Dialog visible={visible} style={{ backgroundColor: '#fff' }}>
                <Dialog.Title>Tentang Aplikasi</Dialog.Title>

                <Dialog.Content>
                    <Text>Versi : 1.0.0</Text>
                    <Text>Terakhir diupdate : 24 September 2024</Text>
                </Dialog.Content>

                <Dialog.Actions>
                    <Button onPress={() => visibleChange(false)}>Tutup</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}
