import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { TrapApiError, Widget, WidgetHeader, WidgetBody, WidgetLoader } from '@mozaik/ui'
import computeRequestId from '../lib/computeRequestId'

const createMarkup = (template, data) => ({
    __html: template(data),
})

export default class CustomJson extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        template: PropTypes.string.isRequired,
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
        const { title, apiData, apiError, template } = this.props

        let body = <WidgetLoader />
        if (apiData && !apiError) {
            const compiled = _.template(template)
            body = <div dangerouslySetInnerHTML={createMarkup(compiled, apiData)} />
        }

        const hasHeader = title && title.length > 0

        return (
            <Widget>
                {hasHeader && <WidgetHeader title={title} />}
                <WidgetBody isHeaderless={hasHeader}>
                    <TrapApiError error={apiError}>{body}</TrapApiError>
                </WidgetBody>
            </Widget>
        )
    }
}
