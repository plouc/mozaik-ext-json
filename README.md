# Mozaïk remote json widgets

This extension contains generic widgets to be used to display remotely fetched json data.

## Widgets

- [JsonKeys](#jsonkeys)
- [CustomJson](#customjson)
- [JsonStatus](#jsonstatus)

### JsonKeys

> Display a list of json keys/values.

#### parameters

key       | required | description
----------|----------|-----------------------------------------------------------------------
`title`   | no       | *Override widget title, default to `url` value*
`url`     | yes      | *The URL to use to fetch the json*
`headers` | no       | *An optional object containing http headers to send with the request*

### CustomJson

> Use a template to display json data.

#### parameters

key        | required | description
-----------|----------|-----------------------------------------------------------------------
`title`    | no       | *Override widget title, default to `url` value*
`url`      | yes      | *The URL to use to fetch the json*
`headers`  | no       | *An optional object containing http headers to send with the request*
`template` | yes      | *The template to be used to display json data*

### JsonStatus

> Display a status depending on json data.

#### parameters

key                  | required | description
---------------------|----------|-----------------------------------------------------------------------
`title`              | no       | *Override widget title, default to `url` value*
`url`                | yes      | *The URL to use to fetch the json*
`headers`            | no       | *An optional object containing http headers to send with the request*
`template`           | yes      | *The template to be used to display json data*
`statuses`           | yes      | *An array of rules used to define current status*
`statuses[n].assert` | yes      | *The assertion to be made on fetched json data, see [format](#assertion-format)*
`statuses[n].status` | yes      | *Resulting status if assertion is met, must be one of: `unknown`, `success`, `warning`, `error`*
`statuses[n].label`  | no       | *An optional label to put under the status icon if assertion is met*

#### assertion format

Assertions support several types:

##### equals

> checks that the resulting value strictly equals expectation

```yaml
statuses:
  - assert: equals(my_key, status_ok)
    status: success
```

will check that `my_key` equals `status_ok`.

##### contains

> checks that the resulting value contains expectation

usage:

```yaml
statuses:
  - assert: contains(my_key, ok)
    status: success
```

will check that `my_key` is contains `ok`.

##### matches

> checks that the resulting value matches regexp

usage:

```yaml
statuses:
  - assert: matches(my_key, (ok|success)$)
    status: success
```

will check that `my_key` is a matches regexp `/(ok|success)$/`.

##### truthy

> checks that the value results in a truthy value

usage:

```yaml
statuses:
  - assert: truthy(my_key)
    status: success
```

will check that `my_key` is a truthy value.

##### falsy

> checks that the value results in a falsy value

usage:

```yaml
statuses:
  - assert: falsy(my_key)
    status: error
```

will check that `my_key` is a falsy value.
