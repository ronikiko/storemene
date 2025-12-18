declare const PostOnlineRivhitonlineapiSvcDocumentNew: {
    readonly body: {
        readonly type: "object";
        readonly properties: {
            readonly api_token: {
                readonly type: "string";
                readonly format: "uuid";
                readonly description: "Rivhit Merchant API Identifier.\n\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["DECD03E5-E35C-41E8-84F7-FBA2FB483928"];
            };
            readonly document_type: {
                readonly type: "integer";
                readonly description: "Document type.\n\n**Range:** 0 to 999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [1];
            };
            readonly customer_id: {
                readonly type: "integer";
                readonly description: "Rivhit Customer Identifier.\n\n**Range:** 0 to 999999999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [0];
            };
            readonly last_name: {
                readonly type: "string";
                readonly description: "Customer Last Name/Company Name.\n\n**Length:** 1 to 30\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["Israeli"];
            };
            readonly first_name: {
                readonly type: "string";
                readonly description: "Customer First Name.\n\n**Length:** 1 to 20\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["Moshe"];
            };
            readonly address: {
                readonly type: "string";
                readonly description: "Customers Address.\n\n**Length:** 1 to 30\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["Ben Yehuda 1"];
            };
            readonly city: {
                readonly description: "Customer's city.\n\n**Length:** 1 to 20\n**Default:** Customer details\n";
                readonly type: "string";
                readonly deprecated: false;
                readonly examples: readonly ["Tel Aviv"];
            };
            readonly zipcode: {
                readonly type: "integer";
                readonly description: "Customers Zipcode.\n\n**Range:** 0 to 9999999\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly [6329302];
            };
            readonly acc_ref: {
                readonly type: "string";
                readonly description: "Customer Outer System Identifier.\n\n**Length:** 1 to 9\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["Ab1234567"];
            };
            readonly phone: {
                readonly type: "string";
                readonly description: "Customer Phone Number.\n\n**Length:** 1 to 15\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["054-4444444"];
            };
            readonly customer_type: {
                readonly type: "integer";
                readonly description: "Type of the Customer - to Create.\n\n**Options:** (1 = Customers 20 = Suppliers 60 = Agents)\n**Default:** Rivhit settings (usually 1)\n";
                readonly deprecated: false;
                readonly enum: readonly [1, 20, 60];
                readonly examples: readonly [1];
            };
            readonly id_number: {
                readonly type: "integer";
                readonly description: "Customer Israeli Id (by Custom Format).\n\n**Range:** 8-9 digits\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [123456790];
            };
            readonly reference: {
                readonly type: "integer";
                readonly description: "The Reference Value - Will be Saved in the Invoice.\n\n**Range:** 0 to 999999999\n**Default:** Rivhit settings\n";
                readonly deprecated: false;
                readonly examples: readonly [12345];
            };
            readonly order: {
                readonly type: "string";
                readonly description: "The Sale Order Value.\n\n**Length:** 1 to 15\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["ab12345"];
            };
            readonly agent_id: {
                readonly type: "integer";
                readonly description: "Agent Id Serial Number (Rivhit system).\n\n**Range:** 0 to 999999999\n**Default:** Customer settings\n";
                readonly deprecated: false;
                readonly examples: readonly [0];
            };
            readonly paying_customer_id: {
                readonly type: "integer";
                readonly description: "Defined a Paying Custommer by Id.\n\n**Range:** 0 to 999999999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [1];
            };
            readonly project_id: {
                readonly type: "integer";
                readonly description: "Project Id Serial Number (Rivhit system).\n\n**Range:** 0 to 999999999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [0];
            };
            readonly comments: {
                readonly type: "string";
                readonly description: "The Customer Comments (to print on the invoice).\n\n**Length:** 1 to 400\n**Default:** Rivhit system settings\n";
                readonly deprecated: false;
                readonly examples: readonly ["Comments will be here"];
            };
            readonly sort_code: {
                readonly type: "integer";
                readonly description: "The Sort Code Type.\n\n**Common:** \n100 = With Vat\n150 = Exempt Vat\n**Range:** 0 to 999\n**Default:** Rivhit Document Settings\n";
                readonly deprecated: false;
                readonly examples: readonly [100];
            };
            readonly discount_type: {
                readonly type: "integer";
                readonly description: "Discount Type.\n\n**Options:** (1 = percentage 2 = amount)\n**Default:** No\n";
                readonly deprecated: false;
                readonly enum: readonly [1, 2];
                readonly examples: readonly [1];
            };
            readonly discount_value: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Discount value.\n\n**Range:** 0 to 999999999.99\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [10];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly price_include_vat: {
                readonly type: "boolean";
                readonly description: "Items Sent With or Without VAT.\n\n**Default:** Document settings\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly due_date: {
                readonly type: "string";
                readonly format: "date";
                readonly description: "Due Date for the Document.\n\n**Format:** DD-MM-YY or DD/MM/YYYY\n**Default:** Rivhit settings\n";
                readonly deprecated: false;
                readonly examples: readonly ["01-01-2025"];
            };
            readonly issue_date: {
                readonly type: "string";
                readonly format: "date";
                readonly description: "Issue Date of the Document.\n\n**Format:** DD-MM-YY or DD/MM/YYYY\n**Default:** Current day\n";
                readonly deprecated: false;
                readonly examples: readonly ["01-01-2025"];
            };
            readonly issue_time: {
                readonly type: "string";
                readonly description: "Issue Time of the Document.\n\n**Format:** HH:MM\n**Default:** Current time\n";
                readonly deprecated: false;
                readonly pattern: "^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$";
                readonly examples: readonly ["10:30"];
            };
            readonly currency_id: {
                readonly type: "integer";
                readonly description: "Document Currency Type.\n\n**Options:** (1 = NIS 2 = USD 3 = EURO 4 = GBP 5 = AUD 6 = CAD 7 = CHF 8 = SEK 9 = DKK 10 = NOK)\n**Default:** Document settings\n";
                readonly deprecated: false;
                readonly examples: readonly [1];
            };
            readonly exchange_rate: {
                readonly type: "number";
                readonly format: "double";
                readonly description: "Fixed Currency Exchange Rate to ILS.\n\n~ From MTC to ILS\n**Range:** Decimal limit (only positive)\n**Default:** Rivhit Settings\n";
                readonly deprecated: false;
                readonly examples: readonly ["3.8"];
                readonly minimum: -1.7976931348623157e+308;
                readonly maximum: 1.7976931348623157e+308;
            };
            readonly reject_item_quantity: {
                readonly type: "boolean";
                readonly description: "Reject Document Producing by Items Stock.\n\nTrue = produce only when items are in stock\nfalse = produce even when items are out of stock\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [false];
            };
            readonly no_update_inventory: {
                readonly type: "boolean";
                readonly description: "Disable Reducing Items From the Stock.\n\nTrue = Don't reduce items from stock\nFalse = Reduce items from stock\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [false];
            };
            readonly crm_user_id: {
                readonly type: "integer";
                readonly description: "CRM User Id (Set the Document Producer).\n\n**Range:** 0 to 99999\n**Default:** Rivhit user settings\n";
                readonly deprecated: false;
                readonly examples: readonly [5];
            };
            readonly language: {
                readonly type: "string";
                readonly description: "Set the Document Language.\n\n**Options:** (he/en)\n**Default:** he\n";
                readonly deprecated: false;
                readonly enum: readonly ["he", "en"];
                readonly examples: readonly ["he"];
            };
            readonly email_to: {
                readonly type: "string";
                readonly format: "email";
                readonly description: "Customer Email Address.\n\n**Length:** 6 to 50\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["a@a.com"];
            };
            readonly email_bcc: {
                readonly type: "string";
                readonly format: "email";
                readonly description: "Bcc Email Address.\n\n**Length:** 6 to 50\n**Default:** Rivhit mailing settings\n";
                readonly deprecated: false;
                readonly examples: readonly ["a@a.com\""];
            };
            readonly digital_signature: {
                readonly type: "boolean";
                readonly description: "Produce the Document With a Digital Signature.\n\ntrue = With digital signature   \n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly signature_pin: {
                readonly type: "string";
                readonly description: "The Digital Signature PIN Code.\n\n~ *Send only by API support instructions*\n**Length:** 3 to 6\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["Ab123"];
            };
            readonly items: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly item_id: {
                            readonly type: "integer";
                            readonly description: "Rivhit Item Identifier.\n\n**Range:** 0 to 999999999\n**Default:** Document settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly [0];
                        };
                        readonly catalog_number: {
                            readonly type: "string";
                            readonly description: "Item Catalog Number (SKU).\n\n**Length:** 1 to 15 \n**Default:** Item details\n";
                            readonly deprecated: false;
                            readonly examples: readonly ["abc123"];
                        };
                        readonly quantity: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "The Item Quantity.\n\n**Range:** 0.1 to 99999999.99\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [1];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly bruto_price_nis: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "The Item Bruto Price in ILS.\n\n~ Send only with ILS Currency\n~ Use with document format for discounts.\n**Range:** Decimal limit (can be negative)\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [10];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly price_nis: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "The Item Price in ILS.\n\n~ Mandatory in ILS charge\n**Range:** Decimal limit (can be negative)\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [10];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly currency_id: {
                            readonly type: "integer";
                            readonly description: "The Item Currency Type.\n\n**Options:** (1 = NIS 2 = USD 3 = EURO 4 = GBP 5 = AUD 6 = CAD 7 = CHF 8 = SEK 9 = DKK 10 = NOK)\n**Default:** Document settings\n";
                            readonly deprecated: false;
                            readonly enum: readonly [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                            readonly examples: readonly [1];
                        };
                        readonly price_mtc: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "The Item Price in foreign currency (MTC).\n\n~ Mandatory in MTC charge\n**Range:** Decimal limit (can be negative) \n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [10];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly exchange_rate: {
                            readonly type: "number";
                            readonly format: "double";
                            readonly description: "Fixed Currency Exchange Rate to ILS.\n\n~ Combine with ConvertToNIS\n**Range:** Decimal limit (only positive)\n**Default:** Rivhit document settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly [3.8];
                            readonly minimum: -1.7976931348623157e+308;
                            readonly maximum: 1.7976931348623157e+308;
                        };
                        readonly storage_id: {
                            readonly type: "integer";
                            readonly description: "Storage Id Serial Number (Rivhit system).\n\n~ The stock will decrease from this storage\n**Range:** 0 to 999999\n**Default:** Rivhit item settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly [1];
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "The Item Description.\n\n**Length:** 1 to 100\n**Default:** Rivhit item settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly ["item test"];
                        };
                        readonly serial_number: {
                            readonly type: "string";
                            readonly description: "Serial number of the item.\n\n**Length:** 1 to 6 \n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly ["String content"];
                        };
                        readonly exempt_vat: {
                            readonly type: "boolean";
                            readonly description: "Indicates if the item is VAT exempt.\n\n**Default:** Rivhit item settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly [true];
                        };
                        readonly closed_document_type: {
                            readonly type: "integer";
                            readonly description: "Document Type to Close With the Item (Partial Closing).\n\n**Range:** 1 to 999\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [1];
                        };
                        readonly closed_document_num: {
                            readonly type: "integer";
                            readonly description: "Document Number to Close With the Item (Partial Closing).\n\n**Range:** 1 to 999999 \n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [211];
                        };
                        readonly closed_document_line: {
                            readonly type: "integer";
                            readonly description: "Set Item Line Number to Close in the Document (Partial Closing).\n\n**Range:** 1 to 232 \n**Default:** No                        \n";
                            readonly deprecated: false;
                            readonly examples: readonly [5];
                        };
                    };
                    readonly required: readonly ["item_id", "quantity", "description", "price_nis", "price_mtc"];
                };
            };
            readonly payments: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly payment_type: {
                            readonly type: "integer";
                            readonly description: "The Payment Type.\n\n~ common Rivhit default values (1 = Check 2 = Cash 4 = Isracard 5 = Visa 9 = Bank Transfer)\n**Range:** 1 to 99\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [2];
                        };
                        readonly amount_nis: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The Payment Price in ILS.\n\n~ Mandatory in ILS charge\n**Range:** Decimal limit (can be negative) \n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [10];
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly due_date: {
                            readonly type: "string";
                            readonly format: "date";
                            readonly description: "Due Date for the Document.\n\n**Format:** DD-MM-YY or DD/MM/YYYY\n**Default:** Rivhit payments settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly ["08-01-2025"];
                        };
                        readonly check_number: {
                            readonly type: "integer";
                            readonly description: "Check/Transaction Voucher Number.\n\n~ Mandatory in check payment\n**Range:** 1 to 99999999\n**Length:** 1 to 8\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [12345678];
                        };
                        readonly bank_code: {
                            readonly type: "integer";
                            readonly description: "Check Bank Code.\n\n~ Mandatory in check payment\n**Range:** 1 to 99\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [11];
                        };
                        readonly branch_number: {
                            readonly type: "integer";
                            readonly description: "Check Bank Branch Number.\n\n~ Mandatory in check payment\n**Range:** 1 to 9999999\n**Length:** 1 to 7\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [118];
                        };
                        readonly bank_account_number: {
                            readonly type: "string";
                            readonly description: "Check Bank Branch Number.\n\n~ Mandatory in check payment\n**Range:** 1 to 999999999\n**Length:** 1 to 9\n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [300111];
                        };
                        readonly amount_mtc: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "The Payment Price in MTC.\n\n~ Mandatory in MTC charge\n**Range:** Decimal limit (can be negative) \n**Default:** No\n";
                            readonly deprecated: false;
                            readonly examples: readonly [10];
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly description: "Payment Description.\n\n**Length:** 1 to 30\n**Default:** Payments settings\n";
                            readonly deprecated: false;
                            readonly examples: readonly ["Cash Payment"];
                        };
                        readonly number_of_payments: {
                            readonly type: "integer";
                            readonly description: "Number of Multiple Payments.\n\n~ The system will divide the payments \n**Range:** 1 to 999\n**Default:** Single payment\n";
                            readonly deprecated: false;
                            readonly examples: readonly [3];
                        };
                    };
                    readonly required: readonly ["payment_type", "amount_nis", "amount_mtc", "description"];
                };
            };
            readonly check_only: {
                readonly type: "boolean";
                readonly description: "Activate Check Mode.\n\n~ Response will include status and error message.                    \n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly request_reference: {
                readonly type: "string";
                readonly description: "The Document Request Reference.\n\n~ Combine with prevent_duplicates\n~ Should be unique value\n**Length:** 2GB\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["abcdefg-&123456789"];
            };
            readonly prevent_duplicates: {
                readonly type: "boolean";
                readonly description: "Activate Prevent Duplicates.\n\n~ Combine with request reference\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly create_customer: {
                readonly type: "boolean";
                readonly description: "Create a New Customer in Rivhit System.\n\n~ When exsiting customer can't be found  \n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly send_mail: {
                readonly type: "boolean";
                readonly description: "Send the Document to the Customer.\n\n**Default:** true\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly find_by_mail: {
                readonly type: "boolean";
                readonly description: "Locate Customer by Email Address.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly find_by_id: {
                readonly type: "boolean";
                readonly description: "Locate Customer by Israeli Id/VAT Number.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly find_by_acc_ref: {
                readonly type: "boolean";
                readonly description: "Locate Customer by the acc_ref\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly find_by_phone: {
                readonly type: "boolean";
                readonly description: "Locate Customer by Phone Number.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly create_items: {
                readonly type: "boolean";
                readonly description: "Create New Items.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly document_number: {
                readonly type: "integer";
                readonly description: "Set the Starting Number for a New Document.\n\n~ Only when it is the first document\n**Range:** 0 to 999999  \n**Default:** Documents settings\n";
                readonly deprecated: false;
                readonly examples: readonly [1000];
            };
            readonly closed_document_type: {
                readonly type: "integer";
                readonly description: "Set the Type of Existing Document to be closed.\n\n~ Combine with ClosedDocumentNumber\n**Range:** 1 to 999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [1];
            };
            readonly closed_document_number: {
                readonly type: "integer";
                readonly description: "Set the Number of Existing Document to be closed.\n\n~ combine with ClosedDocumentType\n**Range:** 1 to 999999\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly [115];
            };
            readonly country: {
                readonly type: "string";
                readonly description: "Customer Country.\n\n**Length:** 1 to 39\n**Default:** Customer details\n";
                readonly deprecated: false;
                readonly examples: readonly ["Israel"];
            };
            readonly state: {
                readonly type: "string";
                readonly description: "Customer State.\n\n**Length:** 1 to 10\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["Texas"];
            };
            readonly foreign_zipcode: {
                readonly type: "string";
                readonly description: "Customer Foreign Zip Code.\n\n**Length:** 1 to 7\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["ab123456"];
            };
            readonly thermal_print: {
                readonly type: "boolean";
                readonly description: "Activate Thermal Print.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [false];
            };
            readonly validate_id: {
                readonly type: "boolean";
                readonly description: "Activate ID/VAT Validation.\n\n~ False = In case of wrong ID/Vat format - data won't be saved on the document and customer.\n**Default:** true\n";
                readonly deprecated: false;
                readonly examples: readonly [true];
            };
            readonly round_digits: {
                readonly type: "integer";
                readonly description: "Round the document amount.\n\n~ Combine with \"price_include_vat\":false\n**Options:** (0 = X.00 Full round 1 = X.X0 Partial 2 = X.XX No round)\n**Default:** Rivhit settings\n";
                readonly deprecated: false;
                readonly enum: readonly [0, 1, 2];
            };
            readonly logo_url: {
                readonly type: "string";
                readonly format: "url";
                readonly description: "The Business Logo - Printed on the Document.\n\n**Length:** 15 to 400\n**Default:** Rivhit system settings\n";
                readonly deprecated: false;
                readonly examples: readonly ["https://www.rivhit.co.il/wp-content/uploads/2023/01/logo-main.svg "];
            };
            readonly default_email: {
                readonly type: "boolean";
                readonly description: "Use the Default Customer Mail Address.\n\n**Default:** false\n";
                readonly deprecated: false;
                readonly examples: readonly [false];
            };
            readonly email_comments: {
                readonly type: "string";
                readonly description: "Additional Comments to the Email Body.\n\n**Length:** 1 to 4000\n**Default:** No\n";
                readonly deprecated: false;
                readonly examples: readonly ["Please find your invoice attached."];
            };
        };
        readonly required: readonly ["api_token", "document_type", "customer_id", "items", "last_name"];
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly error_code: {
                    readonly type: "integer";
                    readonly description: "The Response Error/Status Number (0 = Success)";
                    readonly examples: readonly [0];
                };
                readonly client_message: {
                    readonly type: "string";
                    readonly description: "The Client Error Message.";
                    readonly examples: readonly [""];
                };
                readonly debug_message: {
                    readonly type: "string";
                    readonly description: "The Response Error Message.";
                    readonly examples: readonly [""];
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly document_type: {
                            readonly type: "integer";
                            readonly description: "Document Type.";
                        };
                        readonly document_number: {
                            readonly type: "integer";
                            readonly description: "Document number.";
                        };
                        readonly customer_id: {
                            readonly type: "integer";
                            readonly description: "Customer Identifier.";
                        };
                        readonly document_identity: {
                            readonly type: "string";
                            readonly format: "uuid";
                            readonly description: "Document Identifier.";
                        };
                        readonly document_link: {
                            readonly type: "string";
                            readonly format: "url";
                            readonly description: "Document Link";
                        };
                        readonly print_status: {
                            readonly type: "integer";
                            readonly description: "Digital Signature Error/Status (0 = Success)";
                        };
                        readonly amount: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "Document Amount";
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly confirmation_number: {
                            readonly type: "integer";
                            readonly description: "Confirmation Number.";
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly error: {
                    readonly type: "string";
                    readonly examples: readonly ["Request Error"];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly error_code: {
                    readonly type: "integer";
                    readonly description: "Error code of the response.";
                    readonly examples: readonly [-28];
                };
                readonly client_message: {
                    readonly type: "string";
                    readonly description: "The Client Error Message.";
                    readonly examples: readonly ["ת.ז אינה תקינה"];
                };
                readonly debug_message: {
                    readonly type: "string";
                    readonly description: "The Response Error Message.";
                    readonly examples: readonly ["-28 : INVALID_ID_NUMBER"];
                };
                readonly data: {
                    readonly type: "array";
                    readonly description: "Document Details";
                    readonly items: {};
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { PostOnlineRivhitonlineapiSvcDocumentNew };
