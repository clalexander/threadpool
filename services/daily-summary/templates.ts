export const EMAIL_SUBJECT = 'Threadpool Daily Summary - {{&date}}';

export const EMAIL_BODY = `
THREADPOOL DAILY SUMMARY
{{&startTime}} - {{&endTime}}

New orders: {{ordersCount}} ({{ordersSentCount}} sent to Printful)
New order volume: {{orderVolume}}
Items sold: {{itemsCount}}
Shipments: {{shipmentsCount}} ({{shipmentsWrittenBackCount}} sent to InkSoft)

{{#hasIssues}}
SYSTEM ISSUES
{{#issues}}
{{service}}: {{count}} failure(s)
{{/issues}}
{{/hasIssues}}
`;
