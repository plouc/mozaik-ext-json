import React from 'react'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import renderer from 'react-test-renderer'
import { ThemeProvider } from 'styled-components'
import { WidgetHeader, WidgetLoader, WidgetListItem, defaultTheme } from '@mozaik/ui'
import JsonKeys from './../../src/components/JsonKeys'

Enzyme.configure({ adapter: new Adapter() })

describe('getApiRequest', () => {
    it('should return correct api request', () => {
        expect(
            JsonKeys.getApiRequest({
                url: 'http://fake.io',
            })
        ).toEqual({
            id: `json.request.http://fake.io.`,
            params: {
                url: 'http://fake.io',
                headers: {},
            },
        })
    })

    it('should support additional headers', () => {
        expect(
            JsonKeys.getApiRequest({
                url: 'http://fake.io',
                headers: {
                    'X-Whatever': 'yay',
                },
            })
        ).toEqual({
            id: `json.request.http://fake.io.X-Whatever:yay`,
            params: {
                url: 'http://fake.io',
                headers: {
                    'X-Whatever': 'yay',
                },
            },
        })
    })
})

it('should display loader if no apiData available', () => {
    const wrapper = Enzyme.shallow(<JsonKeys url="http://fake.io" keys={['A']} />)

    expect(wrapper.find(WidgetLoader).exists()).toBeTruthy()
})

describe('title', () => {
    it('should display no header by default', () => {
        const wrapper = Enzyme.shallow(<JsonKeys url="http://fake.io" keys={['A']} />)

        expect(wrapper.find(WidgetHeader).exists()).toBeFalsy()
    })

    it('should support override', () => {
        const wrapper = Enzyme.shallow(
            <JsonKeys url="http://fake.io" keys={['A']} title="override" />
        )

        const header = wrapper.find(WidgetHeader)
        expect(header.prop('title')).toBe('override')
    })
})

it('should display configured key values', () => {
    const wrapper = Enzyme.shallow(
        <JsonKeys
            url="http://fake.io"
            keys={['A', 'B', 'C']}
            apiData={{
                A: 'A value',
                B: 'B value',
                C: 'C value',
            }}
        />
    )

    const items = wrapper.find(WidgetListItem)
    expect(items).toHaveLength(3)
    expect(items.at(0).prop('title')).toBe('A')
    expect(items.at(0).prop('post').props.children).toBe('A value')
    expect(items.at(1).prop('title')).toBe('B')
    expect(items.at(1).prop('post').props.children).toBe('B value')
    expect(items.at(2).prop('title')).toBe('C')
    expect(items.at(2).prop('post').props.children).toBe('C value')
})

it('should support boolean values', () => {
    const wrapper = Enzyme.shallow(
        <JsonKeys
            url="http://fake.io"
            keys={['A']}
            apiData={{
                A: true,
            }}
        />
    )

    const items = wrapper.find(WidgetListItem)
    expect(items).toHaveLength(1)
    expect(items.at(0).prop('title')).toBe('A')
    expect(items.at(0).prop('post').props.children).toBe('true')
})

it('should render as expected', () => {
    const tree = renderer.create(
        <ThemeProvider theme={defaultTheme}>
            <JsonKeys
                url="http://fake.io"
                keys={['A', 'B', 'C']}
                apiData={{
                    A: 'A value',
                    B: 'B value',
                    C: 'C value',
                }}
            />
        </ThemeProvider>
    )

    expect(tree).toMatchSnapshot()
})
