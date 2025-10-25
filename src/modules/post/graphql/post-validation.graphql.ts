import z from "zod"

export const postValidation = z.object({
    id:z.string().length(24).regex(/^[0-9a-fA-F]{24}$/)
})