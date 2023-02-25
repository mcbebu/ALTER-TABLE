package schema

type Address struct {
	EmailAddr  string `json:"emailAddr,omitempty"`
	UserAddr1  string `json:"userAddr1,omitempty"`
	UserAddr2  string `json:"userAddr2,omitempty"`
	UserAddr3  string `json:"userAddr3,omitempty"`
	City       string `json:"city,omitempty"`
	PostalCode string `json:"postalCode,omitempty"`
}
