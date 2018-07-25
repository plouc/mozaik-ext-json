/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import UnknownIcon from 'react-icons/lib/md/help-outline'
import SuccessIcon from 'react-icons/lib/md/done'
import WarningIcon from 'react-icons/lib/md/warning'
import ErrorIcon from 'react-icons/lib/md/error'
import { TrapApiError, Widget, WidgetHeader, WidgetBody } from '@mozaik/ui'
import computeRequestId from '../lib/computeRequestId'

const iconSize = '12vmin'

const bodyStyle = {
    padding: '1vmin 2vmin 2vmin',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
}

const iconWrapperStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const labelStyle = {
    textAlign: 'center',
}

export default class JsonStatus extends Component {
    static propTypes = {
        title: PropTypes.string,
        url: PropTypes.string.isRequired,
        headers: PropTypes.object,
        statuses: PropTypes.arrayOf(
            PropTypes.shape({
                assert: PropTypes.string.isRequired,
                status: PropTypes.oneOf(['unknown', 'success', 'warning', 'error']).isRequired,
                label: PropTypes.string,
            })
        ).isRequired,
        apiData: PropTypes.object,
        apiError: PropTypes.object,
        theme: PropTypes.shape({
            colors: PropTypes.shape({
                unknown: PropTypes.string.isRequired,
                success: PropTypes.string.isRequired,
                warning: PropTypes.string.isRequired,
                failure: PropTypes.string.isRequired,
            }).isRequired,
        }).isRequired,
    }

    static getApiRequest({ url, headers = {} }) {
        return {
            id: computeRequestId(url, headers),
            params: { url, headers },
        }
    }

    render() {
        const { title, url, statuses, apiData, apiError, theme } = this.props

        let body
        let currentStatus = 'unknown'
        let currentLabel
        if (apiData && !apiError) {
            for (let i = 0; i < statuses.length; i++) {
                const status = statuses[i]
                const matches = status.assert.match(
                    /^(equals|contains|matches|truthy|falsy)\(([^,]+),?(.*)\)$/
                )
                if (matches === null) {
                    body = (
                        <div
                            style={{
                                ...bodyStyle,
                                color: theme.colors.failure,
                            }}
                        >
                            invalid assertion:<br />
                            '{status.assert}'<br />
                            should conform to:<br />
                            {'/^(equals|contains|matches)\\((.+),(.+)\\)$/'}
                        </div>
                    )
                    break
                }

                const assertionType = matches[1]
                const key = _.trim(matches[2])
                const expectation = _.trim(matches[3])

                const value = _.get(apiData, key)
                let re
                switch (assertionType) {
                    case 'equals':
                        if (value === expectation) {
                            currentStatus = status.status
                            currentLabel = status.label
                        }
                        break
                    case 'contains':
                        if (
                            value !== undefined &&
                            value !== null &&
                            value.indexOf(expectation) !== -1
                        ) {
                            currentStatus = status.status
                            currentLabel = status.label
                        }
                        break
                    case 'matches':
                        re = new RegExp(expectation)
                        if (value !== undefined && value !== null && re.test(value) === true) {
                            currentStatus = status.status
                            currentLabel = status.label
                        }
                        break
                    case 'truthy':
                        if (!!value === true) {
                            currentStatus = status.status
                            currentLabel = status.label
                        }
                        break
                    case 'falsy':
                        if (!!value === false) {
                            currentStatus = status.status
                            currentLabel = status.label
                        }
                        break
                }
            }
        }

        if (body === undefined) {
            switch (currentStatus) {
                case 'success':
                    body = (
                        <div style={bodyStyle}>
                            <div style={iconWrapperStyle}>
                                <SuccessIcon size={iconSize} color={theme.colors.success} />
                            </div>
                            {currentLabel !== undefined && (
                                <div style={labelStyle}>{currentLabel}</div>
                            )}
                        </div>
                    )
                    break
                case 'warning':
                    body = (
                        <div style={bodyStyle}>
                            <div style={iconWrapperStyle}>
                                <WarningIcon size={iconSize} color={theme.colors.warning} />
                            </div>
                            {currentLabel !== undefined && (
                                <div style={labelStyle}>{currentLabel}</div>
                            )}
                        </div>
                    )
                    break
                case 'error':
                    body = (
                        <div style={bodyStyle}>
                            <div style={iconWrapperStyle}>
                                <ErrorIcon size={iconSize} color={theme.colors.failure} />
                            </div>
                            {currentLabel !== undefined && (
                                <div style={labelStyle}>{currentLabel}</div>
                            )}
                        </div>
                    )
                    break
                default:
                    body = (
                        <div style={bodyStyle}>
                            <div style={iconWrapperStyle}>
                                <UnknownIcon size={iconSize} color={theme.colors.unknown} />
                            </div>
                            {currentLabel !== undefined && (
                                <div style={labelStyle}>{currentLabel}</div>
                            )}
                        </div>
                    )
            }
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
