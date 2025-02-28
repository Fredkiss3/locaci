import { useMutation } from '@tanstack/react-query';

export function useUploadImageMutation() {
    return useMutation(
        async (fileObject: {
            file: File;
            uploadURL: string;
            extension: string;
        }) => {
            await fetch(fileObject.uploadURL, {
                method: 'PUT',
                body: fileObject.file,
                mode: 'cors',
                headers: {
                    'Content-Type': `image/${fileObject.extension}`,
                    'Cache-Control': 'public, max-age=31536000, immutable'
                }
            });
        }
    );
}
