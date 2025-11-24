import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TestComponent from "./__mocks__/components/TestExampleComponent"

test('Example test', async () => {
    render(<TestComponent />)


    await (waitFor(() => {
        expect(screen.getByTestId('test', { exact: false })).toBeDefined()

        expect(screen.getByTestId('test')).toHaveTextContent('Hello world!')
    }));

})