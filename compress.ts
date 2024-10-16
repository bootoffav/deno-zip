import { exists, join } from "./deps.ts";
interface CompressOptions {
  overwrite?: boolean;
  flags: string[];
}
const compressProcess = async (
  files: string | string[],
  archiveName: string = "./archive.zip",
  options?: CompressOptions,
): Promise<boolean> => {
  if (await exists(archiveName) && !(options?.overwrite)) {
    throw `The archive file ${
      join(Deno.cwd(), archiveName)
    }.zip already exists, Use the {overwrite: true} option to overwrite the existing archive file`;
  }
  const runtimeOS = Deno.build.os;

  const filesList = typeof files === "string"
    ? files
    : files.join(runtimeOS === "windows" ? ", " : " ");

  const compressCommandProcess = new Deno.Command(
    runtimeOS === "windows" ? "PowerShell" : "zip",
    {
      args: runtimeOS === "windows"
        ? [
          "Compress-Archive",
          "-Path",
          filesList,
          "-DestinationPath",
          archiveName,
          options?.overwrite ? "-Force" : "",
        ]
        : ["-r", ...options?.flags ?? [], archiveName, ...filesList.split(" ")],
    },
  );
  return (await compressCommandProcess.output()).success;
};

export const compress = async (
  files: string | string[],
  archiveName: string = "./archive.zip",
  options?: CompressOptions,
): Promise<boolean> => {
  return await compressProcess(files, archiveName, options);
};
