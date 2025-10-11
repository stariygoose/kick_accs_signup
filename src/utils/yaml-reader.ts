import * as fs from "fs";
import * as yaml from "js-yaml";
import { UsersConfig } from "../types/types.js";
import logger from "./logger.js";

export function readUsersFromYaml(filePath: string): UsersConfig {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = yaml.load(fileContents) as UsersConfig;

    if (!data || !data.users || !Array.isArray(data.users)) {
      throw new Error("Invalid YAML structure: 'users' array is missing");
    }

    for (const user of data.users) {
      if (!user.email || !user.username) {
        throw new Error(
          "Invalid user structure: each user must have 'email' and 'username' fields"
        );
      }
    }

    logger.info(`Successfully loaded ${data.users.length} users from ${filePath}`);
    return data;
  } catch (error) {
    logger.error(`Error reading YAML file: ${error}`);
    throw error;
  }
}
