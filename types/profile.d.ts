interface IUploadInput {
    uri: string
    name: string
    type: string
}

type ProfileForm = z.infer<typeof schema>

interface IChangePasswordPayload {
    email: string
    currentPassword: string
    newPassword: string
}
