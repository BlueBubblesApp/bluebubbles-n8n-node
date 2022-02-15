/**
 * Sanitizes a hostname to only be the schema and domain name
 *
 * @param host The original host string
 * @returns A sanitized host URL
 */
export const sanitizeHost = (host: string): string => {
    let http = true;
    let finalHost = host.toLowerCase();
    if (finalHost.startsWith('http://')) {
        finalHost = finalHost.replace('http://', '');
    } else if (finalHost.startsWith('https://')) {
        http = false;
        finalHost = finalHost.replace('http://', '');
    }

    if (finalHost.includes('/')) finalHost = finalHost.split('/')[0];
    return `${http ? 'http' : 'https'}://${finalHost}`;
};
