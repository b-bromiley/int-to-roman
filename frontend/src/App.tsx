import { Provider, defaultTheme, View, Heading, Text, Content } from '@adobe/react-spectrum'
import RomanNumeralConverter from './components/RomanNumeralConverter'
import './App.css'

/**
 * Main App component that wraps the application with React Spectrum provider
 * and handles theme switching based on system preferences
 */
function App(): JSX.Element {
  return (
    <Provider theme={defaultTheme}>
      <View
        backgroundColor="default"
        minHeight="100vh"
        padding="size-200"
      >
        <Content>
          <View
            maxWidth="size-5000"
            margin="0 auto"
            padding="size-300"
          >
            <Heading level={1} marginBottom="size-200">
              Roman Numeral Converter
            </Heading>
            
            <Text>
              Convert integers between 1 and 3999 to their Roman numeral representation.
            </Text>
            
            <View marginTop="size-300">
              <RomanNumeralConverter />
            </View>
          </View>
        </Content>
      </View>
    </Provider>
  )
}

export default App