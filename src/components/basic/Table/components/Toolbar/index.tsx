/********************************************************************************
 * Copyright (c) 2023 BMW Group AG
 * Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ClearIcon from '@mui/icons-material/Clear'
import FilterIcon from '@mui/icons-material/FilterAltOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Box, debounce, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../../../Button'
import { Checkbox } from '../../../Checkbox'
import { IconButton } from '../../../IconButton'
import { SearchInput } from '../../../SearchInput'
import { Tooltips } from '../../../ToolTips'
import { Typography } from '../../../Typography'
import { getSelectedFilterUpdate } from './helper'

interface FilterValue {
  value: string
  label?: string
}

interface Filter {
  name: string
  values: FilterValue[]
}

export type SelectedFilter = Record<string, string[]>

interface SearchInputState {
  open: boolean
  text: string
}

export interface AdditionalButtonsType {
  title?: string
  click?: React.MouseEventHandler
  icon?: JSX.Element
}

export interface ToolbarProps {
  title?: string
  rowsCount?: number
  rowsCountMax?: number
  buttonLabel?: string
  onButtonClick?: React.MouseEventHandler
  buttonDisabled?: boolean
  buttonTooltip?: string
  secondButtonLabel?: string
  onSecondButtonClick?: React.MouseEventHandler
  onSearch?: (value: string) => void
  searchExpr?: string
  searchPlaceholder?: string
  searchDebounce?: number
  searchInputData?: SearchInputState
  filter?: Filter[]
  onFilter?: (selectedFilter: SelectedFilter) => void
  openFilterSection?: boolean
  onOpenFilterSection?: (value: boolean) => void
  selectedFilter?: SelectedFilter
  onClearSearch?: () => void
  autoFocus?: boolean
  buttons?: AdditionalButtonsType[]
}

const getIconColor = (openFilter: boolean) => {
  return openFilter ? 'primary' : 'text.tertiary'
}

export const Toolbar = ({
  title,
  rowsCount = 0,
  rowsCountMax = 0,
  buttonLabel,
  onButtonClick,
  buttonDisabled,
  buttonTooltip,
  secondButtonLabel,
  onSecondButtonClick,
  onSearch,
  searchExpr,
  searchPlaceholder,
  searchDebounce = 500,
  searchInputData,
  filter,
  onFilter,
  openFilterSection,
  onOpenFilterSection,
  selectedFilter,
  onClearSearch,
  autoFocus,
  buttons,
}: ToolbarProps) => {
  const { spacing } = useTheme()
  const isSearchText = searchExpr && searchExpr !== ''
  const isSearchData = searchInputData != null ? searchInputData.open : false
  const [openSearch, setOpenSearch] = useState<boolean>(
    !!isSearchText || !!isSearchData
  )
  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState<string>(
    searchExpr ?? (searchInputData != null ? searchInputData.text : '')
  )
  const showMaxRows = rowsCountMax > 0 && rowsCount < rowsCountMax

  const debouncedSearch = useMemo(
    () =>
      debounce((expr: string) => {
        onSearch?.(expr)
      }, searchDebounce),
    [onSearch, searchDebounce]
  )

  const doSearch = useCallback(
    (expr: string) => {
      debouncedSearch(expr)
    },
    [debouncedSearch]
  )

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    const inputLen = e.target.value.length
    if (inputLen === 0 || inputLen > 2) {
      onSearch != null && doSearch(e.target.value)
    }
  }

  const onSearchInputKeyPress = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e.key)
  }

  const handleSearchClear = () => {
    onClearSearch?.()
  }

  const onFilterChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = target
    onFilter?.(
      getSelectedFilterUpdate(selectedFilter ?? {}, name, value, checked)
    )
  }

  useEffect(() => {
    openFilterSection && setOpenFilter(openFilterSection)
  }, [openFilterSection])

  const getEndAdornment = () => {
    if (onClearSearch != null && searchInput) {
      return (
        <IconButton onClick={handleSearchClear}>
          <ClearIcon />
        </IconButton>
      )
    }
  }

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: 'background.background01',
          minHeight: 100,
          padding: spacing(1, 4),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5">
            {title}
            <Box
              component="span"
              sx={{
                typography: 'body1',
                color: 'text.tertiary',
                marginLeft: 1,
              }}
            >
              ({rowsCount || 0}
              {showMaxRows && `/${rowsCountMax}`})
            </Box>
          </Typography>
          {buttonLabel && onButtonClick != null && (
            <Tooltips
              additionalStyles={{
                marginLeft: '50px',
                cursor: 'pointer',
              }}
              tooltipPlacement="top-end"
              tooltipText={buttonTooltip ?? ''}
            >
              <span>
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  size="small"
                  onClick={onButtonClick}
                  sx={{ marginLeft: 15 }}
                  disabled={buttonDisabled}
                >
                  {buttonLabel}
                </Button>
              </span>
            </Tooltips>
          )}
          {secondButtonLabel && onSecondButtonClick != null && (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              size="small"
              onClick={onSecondButtonClick}
              sx={{ marginLeft: 5 }}
            >
              {secondButtonLabel}
            </Button>
          )}
          {buttons?.map((button) => (
            <Button
              key={button.title}
              startIcon={button.icon}
              size="small"
              onClick={button.click}
              sx={{ marginLeft: 5 }}
            >
              {button.title}
            </Button>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {openSearch ? (
            <SearchInput
              autoFocus={autoFocus}
              endAdornment={getEndAdornment()}
              value={searchInput}
              onChange={onSearchInputChange}
              onKeyPress={onSearchInputKeyPress}
              onBlur={() => {
                // empty
              }}
              placeholder={searchPlaceholder}
              sx={{
                '.MuiInputBase-input': {
                  padding: '10px',
                  width: '250px',
                },
              }}
            />
          ) : (
            onSearch != null && (
              <IconButton
                sx={{ color: 'text.tertiary' }}
                onClick={() => {
                  setOpenSearch(true)
                }}
              >
                <SearchIcon />
              </IconButton>
            )
          )}
          {onFilter != null && (
            <IconButton
              sx={{
                alignSelf: 'center',
                color: getIconColor(openFilter),
              }}
              onClick={() => {
                onOpenFilterSection?.(!openFilter)
              }}
            >
              <FilterIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {openFilter &&
        filter?.map(({ name, values }) => (
          <Box
            key={name}
            sx={{
              backgroundColor: 'background.background02',
              borderTop: '1px solid',
              borderColor: 'border.border01',
              padding: spacing(2, 4),
              textAlign: 'right',
            }}
          >
            {values?.map(({ value, label }) => (
              <Box component="span" sx={{ marginLeft: 3 }} key={value}>
                <Checkbox
                  id={`${name}${value}`}
                  name={name}
                  value={value}
                  label={label ?? value}
                  checked={selectedFilter?.[name]?.includes(value)}
                  onChange={onFilterChange}
                />
              </Box>
            ))}
          </Box>
        ))}
    </Box>
  )
}
