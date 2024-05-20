import { validateCpf } from "../../src/domain/validateCpf";

test.each([
    "97456321558",
    "71428793860",
    "87748248800"
])("Should test if the CPF is valid: %s", (cpf: string) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(true);
})

test.each([
    "97456321559",
    null,
    undefined,
    "11111111111"
])("Should test if the CPF is invalid: %s", (cpf: any) => {
    const isValid = validateCpf(cpf);
    expect(isValid).toBe(false);
})
