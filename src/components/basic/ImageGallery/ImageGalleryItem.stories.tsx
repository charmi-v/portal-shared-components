/********************************************************************************
 * Copyright (c) 2023 BMW Group AG
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

import { type StoryFn } from '@storybook/react'
import { ImageItem } from './ImageItem'

export default {
  title: 'ImageGalleryItem',
  component: ImageItem,
}

const Template: StoryFn<typeof ImageItem> = (
  args: React.ComponentProps<typeof ImageItem>
) => <ImageItem {...args} />

export const ImageGalleryItem = Template.bind({})
ImageGalleryItem.args = {
  url: 'https://cdn.pixabay.com/photo/2017/09/05/10/20/business-2717066_1280.jpg',
  text: 'Lorem Image Caption',
  size: 'small-square',
  hover: true,
  borderRadius: true,
  shadow: true,
}
