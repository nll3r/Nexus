'use server';
// nexus/lib/actions/file.actions.ts
import { createAdminClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import {ID, Models, Query} from "node-appwrite";
import {getCurrentUser} from "@/lib/actions/user.actions";


const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
};

export const uploadFile = async ({
                                     file,
                                     ownerId,
                                     accountId,
                                     path
                                     // eslint-disable-next-line no-undef
                                 }: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();




    try {
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile,
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketFileId: bucketFile.$id,
        };

        const newFile = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            ID.unique(),
            fileDocument,
        ).catch(async (error: unknown) => {
            await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
            handleError(error, "Falha ao criar documento do ficheiro");
        });

        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        handleError(error, "Falha ao fazer upload do ficheiro");
    }
};
const createQueries = (currentUser: Models.Document) => {
    const queries = [
        Query.or([
            Query.equal('owner', [currentUser.$id]),
            Query.contains('users', [currentUser.email])
        ]),
    ];


    // TODO: Search, sort, limits...

    return queries;
}
export const getFiles = async () => {
    const { databases } = await createAdminClient();
    try {
        const currentUser = await getCurrentUser();

        if(!currentUser) throw new Error("User not found")
        const queries = createQueries(currentUser);

        console.log({currentUser, queries});

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries,
        );
        console.log({files});

        return parseStringify(files);
    }catch (error) {
        handleError(error, "Falha ao obter ficheiros");}
}