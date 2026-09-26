"""
Customer Support Ticketing System - Training Dataset
Domain: B2B/B2C SaaS & E-Commerce Helpdesk
7 Defined Categories:
- BILLING
- TECHNICAL_SUPPORT
- ACCOUNT_ACCESS
- SHIPPING
- REFUND
- PRODUCT_ISSUE
- GENERAL_INQUIRY
"""

TRAINING_DATA = [
    # BILLING
    ("Payment deducted twice", "I purchased a product but my account was charged two times on my credit card.", "BILLING"),
    ("Double charge on invoice", "Our invoice INV-9021 shows two charges for the same subscription period.", "BILLING"),
    ("Credit card charged unexpectedly", "My card was billed $99 without prior notification or renewal receipt.", "BILLING"),
    ("Incorrect tax on invoice", "The VAT calculation on our monthly statement is 21% instead of 19%.", "BILLING"),
    ("Update payment method failed", "Trying to add a new corporate Visa card keeps failing with gateway decline.", "BILLING"),
    ("Cannot download VAT receipt", "Where can I download the official tax invoice for our quarterly accounting?", "BILLING"),
    ("Subscription auto-renewed without notice", "I was charged for an annual renewal that I intended to pause.", "BILLING"),
    ("Currency conversion discrepancy", "My invoice was billed in USD instead of Euros as agreed in contract.", "BILLING"),
    ("Overcharged for extra user seats", "We only have 10 active users but were billed for 15 enterprise seats.", "BILLING"),
    ("Stripe payment processing error", "Checkout screen says payment failed due to bank processing error 402.", "BILLING"),

    # TECHNICAL_SUPPORT
    ("Application crashes when I upload a file", "Whenever we upload customer batch CSV imports over 40MB, the web app freezes.", "TECHNICAL_SUPPORT"),
    ("API returning 500 internal server error", "Our webhook receiver gets HTTP 500 when polling the REST endpoint.", "TECHNICAL_SUPPORT"),
    ("Database timeout during peak hours", "Database synchronization takes over 300 seconds triggering pool exhaustion.", "TECHNICAL_SUPPORT"),
    ("Webhook delivery failing SSL handshake", "Our internal endpoint receives SSL peer unverified exception on push notifications.", "TECHNICAL_SUPPORT"),
    ("Enterprise API key returning 403 Forbidden", "We generated a new production API token but GET queries reject the Bearer token.", "TECHNICAL_SUPPORT"),
    ("System latency spike on websocket", "Realtime socket connection keeps dropping every 45 seconds under load.", "TECHNICAL_SUPPORT"),
    ("Kafka consumer lag in event pipeline", "Event processing has 10,000 unconsumed messages in the message queue.", "TECHNICAL_SUPPORT"),
    ("Memory leak in background sync service", "Worker node memory usage grows monotonically until OutOfMemoryError.", "TECHNICAL_SUPPORT"),
    ("CORS header missing on preflight OPTIONS", "Browser blocks fetch request due to missing Access-Control-Allow-Origin.", "TECHNICAL_SUPPORT"),
    ("Docker container failing healthcheck", "Service pod in Kubernetes keeps crashing with exit code 137 OOMKilled.", "TECHNICAL_SUPPORT"),

    # ACCOUNT_ACCESS
    ("Cannot login to my account", "I enter my email and password but it says invalid credentials.", "ACCOUNT_ACCESS"),
    ("Reset password link not received", "I clicked forgot password but no reset email arrived in my inbox or spam.", "ACCOUNT_ACCESS"),
    ("Two-factor authentication code invalid", "Google Authenticator 6-digit TOTP code is rejected as expired.", "ACCOUNT_ACCESS"),
    ("SSO redirect loop after domain verification", "Navigating to login redirects back and forth with ERR_TOO_MANY_REDIRECTS.", "ACCOUNT_ACCESS"),
    ("Account locked after multiple failed attempts", "My profile is locked out and asks to contact system administrator.", "ACCOUNT_ACCESS"),
    ("Okta SAML assertion failure", "Logging in through Okta says SAML response signature does not match certificate.", "ACCOUNT_ACCESS"),
    ("Change email address on account", "Our primary admin left the organization and we need to transfer ownership.", "ACCOUNT_ACCESS"),
    ("Disable MFA for lost phone", "I lost my physical phone and need temporary recovery codes to access dashboard.", "ACCOUNT_ACCESS"),
    ("Session expired unexpectedly", "System keeps logging me out every 5 minutes while actively typing.", "ACCOUNT_ACCESS"),
    ("User permissions missing in team portal", "I was invited as an editor but only have read-only viewer privileges.", "ACCOUNT_ACCESS"),

    # SHIPPING
    ("My package has not arrived", "Tracking shows delivered to reception dock, but facilities confirms no courier arrived.", "SHIPPING"),
    ("Tracking number not updating", "FedEx status has been stuck at in-transit for 6 consecutive business days.", "SHIPPING"),
    ("Damaged goods upon parcel delivery", "The cardboard box arrived crushed and the interior hardware unit is cracked.", "SHIPPING"),
    ("Package sent to wrong address", "The courier delivered our shipment to 404 Elm St instead of 500 Oak Avenue.", "SHIPPING"),
    ("Customs clearance delay for international order", "Shipment is held at Frankfurt customs awaiting commercial invoice documentation.", "SHIPPING"),
    ("Missing items in hardware package", "The parcel arrived but box 2 of 2 containing power cords and cables was missing.", "SHIPPING"),
    ("Expedited shipping upgrade requested", "Can we upgrade shipping from ground delivery to overnight priority courier?", "SHIPPING"),
    ("Courier signature required while away", "I will be traveling tomorrow and need to authorize delivery without signature.", "SHIPPING"),
    ("Return shipping label requested", "Please send a prepaid DHL return label for defective warranty replacement.", "SHIPPING"),
    ("Lost parcel investigation with carrier", "The logistics company marked the parcel as lost in transit at sorting hub.", "SHIPPING"),

    # REFUND
    ("I want to request a refund", "We downsized our team by 15 seats and request a prorated refund credit.", "REFUND"),
    ("Cancel subscription and refund balance", "I cancelled within the 30-day money-back guarantee window and want my money back.", "REFUND"),
    ("Refund not credited to bank account", "Your support agent approved a $250 refund 10 days ago but my bank has not received it.", "REFUND"),
    ("Accidental purchase refund request", "One of our junior engineers accidentally ordered the enterprise annual tier.", "REFUND"),
    ("Request reimbursement for downtime SLA breach", "We experienced 6 hours of unplanned downtime and request SLA contractual credit.", "REFUND"),
    ("Chargeback dispute resolution", "We received a chargeback notification and wish to issue a direct voluntary refund.", "REFUND"),
    ("Prorated cancellation credit", "We are migrating to a dedicated private cloud and need refund on unused months.", "REFUND"),
    ("Return product for full refund", "The equipment is incompatible with our server rack and we want a complete refund.", "REFUND"),

    # PRODUCT_ISSUE
    ("The application crashes when uploading", "Software terminates abruptly when rendering complex vector diagrams.", "PRODUCT_ISSUE"),
    ("Dashboard metric charts not updating in real time", "Analytics overview shows stale data unless we perform a hard browser refresh.", "PRODUCT_ISSUE"),
    ("Export to Excel button truncates utf-8 characters", "Accented characters and symbols render as question marks in the spreadsheet.", "PRODUCT_ISSUE"),
    ("Mobile app push notifications stopped working", "Following the latest mobile update, notifications no longer sound an alert.", "PRODUCT_ISSUE"),
    ("Dark mode toggle causes visual contrast glitch", "Text becomes invisible light gray on white background in dark mode.", "PRODUCT_ISSUE"),
    ("Filter dropdown does not persist selected values", "When navigating to page 2, the status filter resets back to show all.", "PRODUCT_ISSUE"),
    ("Form validation error prevents ticket submission", "Clicking submit does nothing and highlights no invalid inputs.", "PRODUCT_ISSUE"),
    ("Search query returns zero results for exact match", "Searching for customer email returns empty list even though record exists.", "PRODUCT_ISSUE"),
    ("Rich text editor strips markdown formatting", "Pasting bold or bullet lists into the response box removes all line breaks.", "PRODUCT_ISSUE"),
    ("Print preview renders overlapping page margins", "Generating PDF reports clips the rightmost column on standard A4 paper.", "PRODUCT_ISSUE"),

    # GENERAL_INQUIRY
    ("Questions about HIPAA compliance and BAA agreement", "We are preparing for our annual medical audit and need a signed BAA agreement.", "GENERAL_INQUIRY"),
    ("Request for custom team onboarding session", "We hired 25 new customer success specialists and want remote training.", "GENERAL_INQUIRY"),
    ("Enterprise pricing details and volume discount", "Could your sales team provide a quotation for 500 employee licenses?", "GENERAL_INQUIRY"),
    ("What are the system requirements for self-hosted edition?", "Does the on-premises installer support Ubuntu 24.04 and ARM64 architecture?", "GENERAL_INQUIRY"),
    ("Feature roadmap for upcoming quarter", "Do you plan to support Microsoft Teams webhook integrations in Q3?", "GENERAL_INQUIRY"),
    ("Customer support hours of operation", "What are the live telephone support hours for customers in the APAC time zone?", "GENERAL_INQUIRY"),
    ("Partnership and reseller inquiries", "We are an IT consultancy interested in becoming a certified implementation partner.", "GENERAL_INQUIRY"),
    ("Whitepaper and technical documentation access", "Where can we review the architectural security overview and pen-test summary?", "GENERAL_INQUIRY")
]
