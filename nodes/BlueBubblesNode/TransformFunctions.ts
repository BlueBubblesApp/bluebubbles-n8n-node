// n8n-specific imports
import { IDataObject } from 'n8n-workflow';

// Defining the column order for the Threat Library results
const columnOrder = [
    'id',
    'value',
    'name',
    'title',
    'type.name',
    'status.name',
    'score',
    'description',
    'published_at',
    'created_at',
];

/**
 * Converts a data collection from BlueBubbles into an n8n result table
 *
 * @param data The BlueBubbles API response data
 * @returns A list of results for an n8n table
 */
export function collectionToTable(data: IDataObject[]): IDataObject[] {
    const output: IDataObject[] = [];

    for (const item of data) {
        const fields: IDataObject = {};
        for (const column of columnOrder) {
            if (column === 'type.name' && Object.keys(item).includes('type')) {
                fields.type = (item.type as IDataObject).name;
            } else if (column === 'status.name' && Object.keys(item).includes('status')) {
                fields.status = (item.status as IDataObject).name;
            } else {
                if (Object.keys(item).includes(column)) {
                    fields[column] = item[column];
                }
            }
        }

        // Compile adversaries
        fields.adversaries = ((item?.adversaries ?? []) as IDataObject[]).map(item => item.name);

        // Compile Attributes
        fields.attributes = ((item.attributes ?? []) as IDataObject[]).map(item =>
            Object({ name: item.name, value: item.value })
        );

        // Compile Sources
        fields.sources = ((item.sources ?? []) as IDataObject[]).map(item => item.name);

        // Add reference URL
        if (Object.keys(item).includes('reference_url')) {
            fields.reference_url = item.reference_url;
        }

        output.push(fields);
    }

    return output;
}
