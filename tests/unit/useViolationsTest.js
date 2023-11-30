import { renderHook } from '@testing-library/react-native';
import { useViolations, violationFields } from '@libs/Violations/useViolations';


// Derive test cases from the violationFields object
const allViolations = Object.keys(violationFields).map((name) => ({name}));
// A list of all the field names that appear in `violationFields`
const fieldNames = [...new Set(Object.values(violationFields))];
// create an index of violations by field name
const violationsByField = Object.entries(violationFields).reduce(
    (acc, [violation, field]) => ({
        ...acc,
        [field]: [...(acc[field] || []), {name: violation}],
    }),
    {},
);

describe('useViolations', () => {
    let violations = [];

    beforeEach(() => {
        violations = allViolations;
    });

    // The happy path
    function callHook() {
        const {result, rerender} = renderHook(() => useViolations(violations));
        return {result, rerender};
    }

    it('returns correct values when there is only a single violation', () => {
        const violation = violations[0];
        violations = [violation];
        const {result} = callHook();
        const expectedField = violationFields[violation.name];
        expect(result.current.hasViolations(expectedField)).toBe(true);
        expect(result.current.getViolationsForField(expectedField)).toEqual([violation]);
    });

    it('returns correct values when there are multiple violations on different fields', () => {
        const violation1 = violations[0];
        const violation2 = violations[1];
        violations = [violation1, violation2];

        const {result} = callHook();

        const expectedField1 = violationFields[violation1.name];
        const expectedField2 = violationFields[violation2.name];
        expect(result.current.hasViolations(expectedField1)).toBe(true);
        expect(result.current.getViolationsForField(expectedField1)).toEqual([violation1]);
        expect(result.current.hasViolations(expectedField2)).toBe(true);
        expect(result.current.getViolationsForField(expectedField2)).toEqual([violation2]);
    });

    it('returns correct values when there are multiple violations on the same field', () => {
        violations = violationsByField.amount;
        const expectedField = 'amount';

        const {result} = callHook();

        expect(result.current.hasViolations(expectedField)).toBe(true);
        expect(result.current.getViolationsForField(expectedField)).toEqual(violations);
    });

    it('returns correct values for empty violations', () => {
        violations = [];
        const {result} = callHook();
        fieldNames.forEach((field) => {
            expect(result.current.hasViolations(field)).toBe(false);
            expect(result.current.getViolationsForField(field)).toEqual([]);
        });
    });

    it('returns correct values for non-existing violation name', () => {
        violations = [{name: 'nonExistingViolation'}];
        const {result} = callHook();
        fieldNames.forEach((field) => {
            expect(result.current.hasViolations(field)).toBe(false);
            expect(result.current.getViolationsForField(field)).toEqual([]);
        });
    });

    it('returns correct values for non-existing field', () => {
        const field = 'nonExistingField';
        const {result} = callHook();
        expect(result.current.hasViolations(field)).toBe(false);
        expect(result.current.getViolationsForField(field)).toEqual([]);
    });

    describe('returns correct values for all violations', () => {
        // eslint-disable-next-line rulesdir/prefer-underscore-method
        it.each(fieldNames)('returns correct values for field %s', (field) => {
            const {result} = callHook();
            const expectedViolations = violationsByField[field] || [];
            expect(result.current.hasViolations(field)).toBe(expectedViolations.length > 0);
            expect(result.current.getViolationsForField(field)).toEqual(expectedViolations);
        });
    });
});
