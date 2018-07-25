import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
    TrapApiError,
    Widget,
    WidgetHeader,
    WidgetBody,
    WidgetLoader,
    WidgetListItem,
} from '@mozaik/ui'
import computeRequestId from '../lib/computeRequestId'

export default class JsonKeys extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        keys: PropTypes.arrayOf(PropTypes.string).isRequired,
        apiData: PropTypes.object,
        apiError: PropTypes.object,
    }

    static getApiRequest({ url, headers = {} }) {
        return {
            id: computeRequestId(url, headers),
            params: { url, headers },
        }
    }

    render() {
        const { title, url, keys, apiData, apiError } = this.props

        let body = <WidgetLoader />
        if (apiData && !apiError) {
            body = (
                <div>
                    {keys.map(key => {
                        let value = _.get(apiData, key)
                        if (_.isBoolean(value)) {
                            value = value ? 'true' : 'false'
                        }

                        return (
                            <WidgetListItem key={key} title={key} post={<strong>{value}</strong>} />
                        )
                    })}
                </div>
            )
        }

        return (
            <Widget>
                <WidgetHeader title={title || url} />
                <WidgetBody>
                    <TrapApiError error={apiError}>{body}</TrapApiError>
                </WidgetBody>
            </Widget>
        )
    }
}
